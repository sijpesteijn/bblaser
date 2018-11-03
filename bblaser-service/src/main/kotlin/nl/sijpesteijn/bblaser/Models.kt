package nl.sijpesteijn.bblaser

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.annotation.JsonTypeName
import javafx.geometry.Orientation
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@JsonTypeName("shape_move")
data class BBShapeMoveEffect(
        override val id: Long,
        override val name: String,
        override val start: Long,
        override val duration: Long,
        val startPosition: BBPoint,
        val endPosition: BBPoint) : BBEffect

@JsonTypeName("shape_rotate")
data class BBShapeRotateEffect(
        override val id: Long,
        override val name: String,
        override val start: Long,
        override val duration: Long,
        val degrees: Long) : BBEffect

@JsonTypeName("shape_resize")
data class BBShapeResizeEffect(
        override val id: Long,
        override val name: String,
        override val start: Long,
        override val duration: Long,
        val scale: Long) : BBEffect

@JsonTypeName("shape_flip")
data class BBShapeFlipEffect(
        override val id: Long,
        override val name: String,
        override val start: Long,
        override val duration: Long,
        val orientation: Orientation) : BBEffect

@JsonTypeName("color_gradient")
data class BBColorGradientEffect(
        override val id: Long,
        override val name: String,
        override val start: Long,
        override val duration: Long,
        val startColor: BBColor,
        val endColor: BBColor) : BBEffect

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXTERNAL_PROPERTY, property = "type")
@JsonSubTypes(
        JsonSubTypes.Type(name = "color_gradient", value = BBColorGradientEffect::class),
        JsonSubTypes.Type(name = "shape_move", value = BBShapeMoveEffect::class),
        JsonSubTypes.Type(name = "shape_flip", value = BBShapeFlipEffect::class),
        JsonSubTypes.Type(name = "shape_rotate", value = BBShapeRotateEffect::class),
        JsonSubTypes.Type(name = "shape_resize", value = BBShapeResizeEffect::class)
        )
interface BBEffect {
    val id: Long
    val name: String
    val start: Long
    val duration: Long
}

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXTERNAL_PROPERTY, property = "type")
@JsonSubTypes(JsonSubTypes.Type(name = "line", value = BBLine::class), JsonSubTypes.Type(name = "box", value = BBBox::class))
interface BBShape {
    val points: List<BBPoint>
    val color: BBColor
}

@JsonTypeName("line")
data class BBLine(override val points: List<BBPoint>, override val color: BBColor) : BBShape

@JsonTypeName("box")
data class BBBox(override val points: List<BBPoint>, override val color: BBColor) : BBShape

data class BBPoint(val x: Int, val y: Int)
data class BBColor(val red: Int, val green: Int, val blue: Int)

data class BBAppearance(var id: Long, val start: Long, val duration: Long, val effects: List<BBEffect> = ArrayList())

data class BBElement(val id: Long, val name: String, val shape: BBShape, val appearances: List<BBAppearance> = ArrayList())

@Document(collection = "animations")
data class BBAnimation(@Id val id: String?, val title: String, var last_update: Long, val elements: List<BBElement> = ArrayList())