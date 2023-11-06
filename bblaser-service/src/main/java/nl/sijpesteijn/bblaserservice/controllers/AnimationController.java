package nl.sijpesteijn.bblaserservice.controllers;

import nl.sijpesteijn.bblaserservice.converters.BBAnimationConverter;
import nl.sijpesteijn.bblaserservice.domain.BBAnimation;
import nl.sijpesteijn.bblaserservice.converters.IldaConverter;
import nl.sijpesteijn.bblaserservice.domain.ilda.Ilda;
import nl.sijpesteijn.bblaserservice.services.AnimationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class AnimationController {

    private AnimationService animationService;
    private IldaConverter ildaConverter = new IldaConverter();
    private BBAnimationConverter bbAnimationConverter = new BBAnimationConverter();

    public AnimationController(final AnimationService animationService) {
        this.animationService = animationService;
    }

    @GetMapping("/animation")
    public ResponseEntity<Page<BBAnimation>> getAnimations(@RequestParam(value = "sort", defaultValue = "title") String sort,
                                                           @RequestParam(value = "direction", defaultValue = "desc") String direction,
                                                           @RequestParam(value = "page", defaultValue = "0") Integer page,
                                                           @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize, Sort.Direction.fromString(direction), sort);
        return ResponseEntity.ok(animationService.getAnimations(pageable));
    }

    @GetMapping("/animation/{id}")
    public ResponseEntity<BBAnimation> getAnimation(@PathVariable(value = "id") String id) {
        return ResponseEntity.ok(animationService.getAnimation(id));
    }

    @PostMapping(value = "/animation/upload", consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<Void> upload(@RequestParam("file")MultipartFile multipartFile) throws IOException {
        Ilda ilda = ildaConverter.fromBytes(multipartFile.getBytes());
        BBAnimation animation = bbAnimationConverter.convert(ilda, multipartFile.getOriginalFilename());
        animationService.save(animation);
        return ResponseEntity.ok().build();
    }
}
