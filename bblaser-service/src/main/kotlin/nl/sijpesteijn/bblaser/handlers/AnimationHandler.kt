package nl.sijpesteijn.bblaser.handlers

import nl.sijpesteijn.bblaser.*
import nl.sijpesteijn.bblaser.ilda.Ilda
import nl.sijpesteijn.bblaser.ilda.IldaConverter
import nl.sijpesteijn.bblaser.services.AnimationService
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*
import kotlin.collections.ArrayList


@RestController
class AnimationHandler(private val animationService: AnimationService) {

    @Value("#{systemProperties['user.dir']}")
    lateinit var dir: String
    val ildaReader = IldaConverter()

    @GetMapping("/animations")
    fun all(@RequestParam(value = "sort", defaultValue = "title") sort: String,
            @RequestParam(value = "direction", defaultValue = "desc") direction: String,
            @RequestParam(value = "page", defaultValue = "0") page: Int,
            @RequestParam(value = "pageSize", defaultValue = "10") pageSize: Int): ResponseEntity<Page<BBAnimation>> {
        val pageable = PageRequest.of(page, pageSize, Sort.Direction.fromString(direction), sort)
        val data = animationService.all(pageable)
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(data)
    }

    @GetMapping("/animations/{id}")
    fun get(@PathVariable("id") id: String): ResponseEntity<Optional<BBAnimation>> =
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(animationService.getById(id))

    @PostMapping("/animations/")
    fun save(@RequestBody(required = true) animation: BBAnimation): ResponseEntity<BBAnimation> =
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(animationService.save(animation))

    @PutMapping("/animations/{id}")
    fun update(@PathVariable("id") id: String,
               @RequestBody(required = true) animation: BBAnimation): ResponseEntity<BBAnimation> =
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(animationService.update(animation))


    @DeleteMapping("/animations/{id}")
    fun remove(@PathVariable("id") id: String): ResponseEntity<Void> {
        animationService.remove(id)
        return ResponseEntity.ok().build()
    }

    @PostMapping(value = "/animations/upload",
            consumes = ["multipart/form-data"], produces = ["application/json"])
    fun upload(@RequestParam("file") multipartFile: MultipartFile): ResponseEntity<Void> {
        val content = ildaReader.read(multipartFile.bytes)
        val animation = convert(content, multipartFile.name)

        animationService.save(animation)
        return ResponseEntity.ok().build()
    }

    private fun convert(ilda: Ilda, filename: String): BBAnimation {

        val elements = this.getElements(ilda)
        return BBAnimation(null, filename, Date().time, elements)
    }

    private fun getElements(ilda: Ilda): List<BBElement> {
        var elementNr = 0L
        var indent = 0L
        val elements: MutableList<BBElement> = mutableListOf()
        ilda.IldaFrames.forEach { ildaFrame ->
            val appearance = BBAppearance(0, indent * 500, 500)
            var element: BBElement? = null
            var points = ArrayList<BBPoint>()
            ildaFrame.coordinateDataList?.forEach {
                if (it.blanked) {
                    if (element != null) {
                        elements.add(element!!)
                        element = null
                    }
                } else {
                    if (element == null) {
                        points = ArrayList()
                        val line = BBLine(points, BBColor(it.colorData!!.red1, it.colorData!!.green1, it.colorData!!.blue1))
                        element = BBElement(elementNr++, "Line $elementNr", line, arrayListOf(appearance))
                    }
                    val point = BBPoint(it.x + 32768, 65534 - (it.y + 32767))
                    points.add(point)
                }
            }
            indent++
        }
        return elements
    }

//    private fun getSegments(segmentList: List<CoordinateData>?): List<Segment> {
//        val segments: MutableList<Segment> = mutableListOf()
//        var segment: Segment? = null
//        var points = ArrayList<List<Int>>()
//        var id = 0;
//        segmentList?.forEach {
//            if (it.blanked) {
//                if (segment != null) {
//                    segments.add(segment!!)
//                    segment = null
//                }
//            } else {
//                if (segment == null) {
//                    val color = ArrayList<Int>()
//                    color.add(it.colorData!!.red1)
//                    color.add(it.colorData!!.green1)
//                    color.add(it.colorData!!.blue1)
//                    points = ArrayList()
//                    segment = Segment(id++, color, false, points)
//                }
//                val point = ArrayList<Int>()
//                point.add(it.x + 32768)
//                point.add(65534 - (it.y + 32767))
//                points.add(point);
//
//            }
//        }
//        return segments
//    }

}
