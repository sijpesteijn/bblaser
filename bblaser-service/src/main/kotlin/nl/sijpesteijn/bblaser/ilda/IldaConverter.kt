package nl.sijpesteijn.bblaser.ilda

import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.*

class IldaConverter {
    private val coordinateHeaderSize = 32
    private val coordinateDataSize = 8
    private val colorHeaderSize = 32
    private val colorDataSize = 6
    private val colorDataTable = IldaColorTable()
    private var maxHeight = 0
    private var minHeight = 0
    private var maxWidth = 0
    private var minWidth = 0
    private var maxDepth = 0
    private var minDepth = 0


    fun read(data: ByteArray): Ilda {
        var colorHeader: ColorHeader? = null
        val colorDataList: MutableList<ColorData> = mutableListOf()
        var offset = 0
        val coordinateHeaderList = mutableListOf<IldaFrame>()
        var coordinateHeader = extractFrame(data, offset)
        coordinateHeaderList.add(coordinateHeader)

        while (coordinateHeader.totalPoints > 0) {
            offset += coordinateHeaderSize + (coordinateDataSize*coordinateHeader.totalPoints)
            coordinateHeader = extractFrame(data, offset)
            coordinateHeaderList.add(coordinateHeader)
        }

        val startColorHeader = offset + coordinateHeaderSize + (coordinateHeader.totalPoints * coordinateDataSize)

        if (startColorHeader < data.size) {
            val dataBlock = data.copyOfRange(startColorHeader, startColorHeader + colorHeaderSize)
            colorHeader = extractColorHeader(dataBlock)

            val startColoData = startColorHeader + colorHeaderSize
            for ( i in 0..colorHeader.totalColors) {
                val dataSubBlock = dataBlock.copyOfRange(startColoData + i * colorDataSize,
                                                         startColoData + (i + 1) * colorDataSize)
                colorDataList.add(extractColorData(dataSubBlock))
            }
        }

        return Ilda(
                minWidth,
                maxWidth,
                minHeight,
                maxHeight,
                minDepth,
                maxDepth,
                colorHeader,
                coordinateHeaderList,
                colorDataList
        )
    }

    private fun extractFrame(data: ByteArray, offset: Int): IldaFrame {
        val protocol = "" + data[0 + offset].toChar() + data[1 + offset].toChar() + data[2 + offset].toChar() + data[3 + offset].toChar()
        val threeD = data[7 + offset].toInt() == 0
        val frameName = extractString(data, 8 + offset, 15 + offset)
        val companyName = extractString(data, 16 + offset, 23 + offset)

        val totalPoints = extractInteger(data[24 + offset], data[25 + offset])
        val frameNumber = extractInteger(data[26 + offset], data[27 + offset])
        val totalFrames = extractInteger(data[28 + offset], data[29 + offset])
        val scannerHead = extractSmallInteger(data[30 + offset])

        val coordinateDataList = mutableListOf<CoordinateData>()
        for(i in 0..totalPoints) {
            val dataBlock = data.copyOfRange(offset + coordinateHeaderSize + i * coordinateDataSize,
                    offset + coordinateHeaderSize + (i + 1) * coordinateDataSize)
            coordinateDataList.add(createCoordinateData(dataBlock))
        }

        return IldaFrame(protocol, threeD, frameName, companyName, totalPoints, frameNumber, totalFrames, scannerHead, coordinateDataList)
    }

    private fun extractColorHeader(data: ByteArray): ColorHeader {
        val protocol = "" + data[0] + data[1] + data[2] + data[3]
        val formatCode = extractSmallInteger(data[7])
        val paletteName = extractString(data, 8, 15)
        val companyName = extractString(data, 16, 23)
        val totalColors = extractInteger(data[24], data[25])
        val paletteNumber = extractInteger(data[26], data[27])
        val scannerHead = extractSmallInteger(data[30])
        return ColorHeader(scannerHead, paletteNumber, totalColors, companyName, paletteName, formatCode, protocol)
    }

    private fun extractColorData(data: ByteArray): ColorData {
        val red1 = extractSmallInteger(data[0])
        val red2 = extractSmallInteger(data[1])
        val green1 = extractSmallInteger(data[2])
        val green2 = extractSmallInteger(data[3])
        val blue1 = extractSmallInteger(data[4])
        val blue2 = extractSmallInteger(data[5])
        return ColorData(red1, red2, green1, green2, blue1, blue2, 12)
    }

    private fun createCoordinateData(data: ByteArray): CoordinateData {
        val x = extractCoordinate(data[0], data[1])
        val y = extractCoordinate(data[2], data[3])
        val z = extractCoordinate(data[4], data[5])
        val blanked = isBitSet(data[6], 6)

        if (!blanked) {
            setMaxMinValue(x, y, z)
        }

        val endImageData = isBitSet(data[6], 7)
        val colorCode = extractSmallInteger(data[7])
        val color = colorDataTable.getColor(colorCode)
        return CoordinateData(x, y, x, color, blanked, endImageData)
    }

    private fun extractString(fileArray: ByteArray, start: Int, stop: Int): String {
        var name = ""
        for (i in start..stop) {
            name += fileArray[i].toChar()
        }
        return name
    }

    private fun extractInteger(b: Byte, b1: Byte): Int {
        val high = b.toInt() and 0xff
        val low = b1.toInt() and 0xff
        return high shl 8 or low
    }

    private fun extractSmallInteger(b: Byte): Int {
        return b.toInt() and 0xff
    }

    private fun extractCoordinate(b: Byte, b1: Byte): Int {
        return (b.toInt() and 0xFF shl 8 or (b1.toInt() and 0xFF)).toShort().toInt()
    }

    private fun setMaxMinValue(x: Int, y: Int, z: Int) {
        if (x > maxWidth) {
            maxWidth = x
        }
        if (x < minWidth) {
            minWidth = x
        }
        if (y > maxHeight) {
            maxHeight = y
        }
        if (y < minHeight) {
            minHeight = y
        }
        if (z > maxDepth) {
            maxDepth = z
        }
        if (z < minDepth) {
            minDepth = z
        }

    }

    private fun isBitSet(b: Byte, bit:Int): Boolean {
        return b.toInt() and (1 shl bit) != 0
    }
}

data class ColorHeader(val scannerHead: Int,
                       val paletteNumber: Int,
                       val totalColors: Int,
                       val companyName: String,
                       val paletteName: String,
                       val formatCode: Int,
                       val protocol: String)
data class ColorData(val red1: Int,
                     val red2: Int,
                     val green1: Int,
                     val green2: Int,
                     val blue1: Int,
                     val blue2: Int,
                     val code: Int)
data class CoordinateData(val x: Int,
                          val y: Int,
                          val z: Int,
                          val colorData: ColorData?,
                          val blanked: Boolean,
                          val endImageDate: Boolean)
data class IldaFrame(val protocol: String,
                     val threeD: Boolean,
                     val frameName: String,
                     val companyName: String,
                     val totalPoints: Int,
                     val frameNumber: Int,
                     val totalFrames: Int,
                     val scannerHead: Int,
                     var coordinateDataList: List<CoordinateData>?)
data class Ilda(val minWidth: Int,
                val maxWidth: Int,
                val minHeight: Int,
                val maxHeight: Int,
                val minDepth: Int,
                val maxDepth: Int,
                val colorHeader: ColorHeader?,
                val IldaFrames: List<IldaFrame>,
                val colorDataList: MutableList<ColorData>)

class IldaColorTable {
    private val colors = HashMap<Int, ColorData>()

    init {
        val inputStream = javaClass.getResourceAsStream("/ildaColorTable.csv")
        val reader = BufferedReader(InputStreamReader(inputStream))
        reader.lines().forEach {
            line ->
            val splits = line.split(" ")
            val code = splits[0].toInt()
            val red = splits[1].toInt()
            val green = splits[2].toInt()
            val blue = splits[3].toInt()
            val colorData = ColorData(red, red, green, green, blue, blue, code)
            colors[code] = colorData
        }
    }

    fun getColor(colorNr: Int): ColorData? {
        return colors[colorNr]
    }
}