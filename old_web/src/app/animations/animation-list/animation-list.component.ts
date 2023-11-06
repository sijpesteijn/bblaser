import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { AnimationPagedCollection, BBAnimation } from '../animation.service';
import { humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput, UploadStatus } from 'ngx-uploader';
import { ANIMATION_UPLOAD, EndpointsService } from '../../endpoints.service';
import { Router } from '@angular/router';
import { AnimationDeleteDialogComponent } from '../animation-delete-dialog/animation-delete-dialog.component';
import { Store } from '@ngrx/store';

import * as animationStore from '../animation-store';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'bb-animation-list',
  templateUrl: './animation-list.component.html',
  styleUrls: ['./animation-list.component.scss']
})
export class AnimationListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  animationsPage: AnimationPagedCollection;
  displayedColumns = [ 'title', 'remove'];
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  selectedAnimation: BBAnimation;
  tableHighlight = false;
  pageSize = 10;
  dialogRef;
  preview = true;

  constructor(private store: Store<animationStore.AnimationsState>,
              private endpointService: EndpointsService,
              public dialog: MatDialog,
              private router: Router) {
    this.options = { concurrency: 1 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.store.dispatch(new animationStore.SelectAnimationAction(undefined));
    this.store.select(animationStore.selectAllAnimations).subscribe(animationsPage => {
      if (animationsPage) {
        this.animationsPage = animationsPage;
      }
    });
  }

  ngAfterViewInit() {
    this.emitChange();
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.endpointService.get(ANIMATION_UPLOAD),
        method: 'POST',
      };

      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    } else if (output.type === 'start') {
      this.tableHighlight = false;
    } else if (output.type === 'done') {
      this.emitChange();
    }

    this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
  }

  previewAnimation(animation) {
    if (animation) {
      this.selectedAnimation = animation;
      if (this.preview) {
        this.store.dispatch(new animationStore.PreviewAnimation(animation));
      }
    } else {
      this.selectedAnimation = undefined;
      if (this.preview) {
        this.store.dispatch(new animationStore.PreviewAnimation(undefined));
      }
    }
  }

  highlightTable(show: boolean) {
    this.tableHighlight = show;
  }

  openAnimation(animation) {
    this.store.dispatch(new animationStore.PreviewAnimation(undefined));
    this.router.navigate(['/animations/' + animation.id]);
  }

  removeAnimation(animation: BBAnimation) {
    this.dialogRef = this.dialog.open(AnimationDeleteDialogComponent, {
       data: animation
    });

    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.paginator.pageIndex = 0;
        this.store.dispatch(new animationStore.RemoveAnimationAction(animation, {
          page: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          direction: this.sort ? this.sort.direction : 'desc',
          sort: this.sort ? this.sort.active : this.displayedColumns[0]}));
      }
    });
  }

  newAnimation() {
    this.store.dispatch(new animationStore.SaveAnimationAction({
      title: 'New Animation', last_update: moment().valueOf(), elements: []}, true));
  }

  emitChange() {
    this.store.dispatch(new animationStore.LoadAnimationsAction({
      page: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      direction: this.sort ? this.sort.direction : 'desc',
      sort: this.sort ? this.sort.active : this.displayedColumns[0]}));
  }
}
