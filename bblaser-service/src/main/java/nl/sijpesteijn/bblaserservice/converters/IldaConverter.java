package nl.sijpesteijn.bblaserservice.converters;

import nl.sijpesteijn.bblaserservice.domain.ilda.*;
import org.springframework.cglib.core.TinyBitSet;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class IldaConverter {
    private int coordinateHeaderSize = 32;
    private int coordinateDataSize = 8;
    private int colorHeaderSize = 32;
    private int colorDataSize = 6;
    private IldaColorTable colorDataTable = new IldaColorTable();
    private int maxHeight = 0;
    private int minHeight = 0;
    private int maxWidth = 0;
    private int minWidth = 0;
    private int maxDepth = 0;
    private int minDepth = 0;

    public Ilda fromBytes(final byte[] data) {
        List<ColorData> colorDataList = new ArrayList<>();
        ColorHeader colorHeader = null;
        int offset = 0;
        List<IldaFrame> frames = new ArrayList<>();
        IldaFrame frame = extractFrame(data, offset);
        frames.add(frame);

        while (frame.getTotalPoints() > 0) {
            offset += coordinateHeaderSize + (coordinateDataSize*frame.getTotalPoints());
            frame = extractFrame(data, offset);
            frames.add(frame);
        }

        Integer startColorHeader = offset + coordinateHeaderSize + (frame.getTotalPoints() * coordinateDataSize);

        if (startColorHeader < data.length) {
            byte[] dataBlock = Arrays.copyOfRange(data, startColorHeader, startColorHeader + colorHeaderSize);
            colorHeader = extractColorHeader(dataBlock);

            Integer startColorData = startColorHeader + colorHeaderSize;
            for (int i = 0; i < colorHeader.getTotalColors(); i++) {
                byte[] subDataBlock =  Arrays.copyOfRange(dataBlock, startColorData + i * colorDataSize,
                        startColorData + (i + 1) * colorDataSize);
                colorDataList.add(extractColorData(subDataBlock));
            }
        }

        return new Ilda(minWidth, maxWidth, minHeight, maxHeight, minDepth, maxDepth, colorHeader, frames, colorDataList);
    }

    private ColorData extractColorData(byte[] data) {
        Integer red1 = extractSmallInteger(data[0]);
        Integer red2 = extractSmallInteger(data[1]);
        Integer green1 = extractSmallInteger(data[2]);
        Integer green2 = extractSmallInteger(data[3]);
        Integer blue1 = extractSmallInteger(data[4]);
        Integer blue2 = extractSmallInteger(data[5]);
        return new ColorData(red1, red2, green1, green2, blue1, blue2, 12);
    }

    private IldaFrame extractFrame(byte[] data, int offset) {
        String protocol = "" + data[0 + offset] + data[1 + offset] + data[2 + offset] + data[3 + offset];
        Boolean threeD = data[7 + offset] == '0';
        String frameName = extractString(data, 8 + offset, 15 + offset);
        String companyName = extractString(data, 16 + offset, 23 + offset);

        Integer totalPoints = extractInteger(data[24 + offset], data[25 + offset]);
        Integer frameNumber = extractInteger(data[26 + offset], data[27 + offset]);
        Integer totalFrames = extractInteger(data[28 + offset], data[29 + offset]);
        Integer scannerHead = extractSmallInteger(data[30 + offset]);

        List<CoordinateData> coordinateDataList = new ArrayList<>();

        for (int i = 0; i < totalPoints; i++) {
            coordinateDataList.add(createCoordinateData(Arrays.copyOfRange(data, offset + coordinateHeaderSize + i * coordinateDataSize,
                    offset + coordinateHeaderSize + (i + 1) * coordinateDataSize)));
        }

        return new IldaFrame(protocol, threeD, frameName, companyName, totalPoints, frameNumber, totalFrames, scannerHead, coordinateDataList);
    }

    private CoordinateData createCoordinateData(byte[] dataBlock) {
        int x = extractCoordinate(dataBlock[0], dataBlock[1]);
        int y = extractCoordinate(dataBlock[2], dataBlock[3]);
        int z = extractCoordinate(dataBlock[4], dataBlock[5]);
        boolean blanked = isBitSet(dataBlock[6], 6);

        if (!blanked) {
            setMaxMinValue(x, y, z);
        }
        boolean endImageData = isBitSet(dataBlock[6], 7);
        Integer colorCode = extractSmallInteger(dataBlock[7]);
        ColorData color = colorDataTable.getColor(colorCode);

        return new CoordinateData(x, y, z, color, blanked, endImageData);
    }

    private boolean isBitSet(byte b, int bit) {
        return (b & (1 << bit)) != 0;
    }

    private int extractCoordinate(byte b1, byte b2) {
        return (b1 & 0xff) << 8 | (b2 & 0xff);
    }

    private ColorHeader extractColorHeader(byte[] data) {
        String protocol = "" + data[0] + data[1] + data[2] + data[3];
        Integer formatCode = extractSmallInteger(data[7]);
        String paletteName = extractString(data, 8, 15);
        String companyName = extractString(data, 16, 23);
        Integer totalColors = extractInteger(data[24], data[25]);
        Integer paletteNumber = extractInteger(data[26], data[27]);
        Integer scannerHead = extractSmallInteger(data[30]);
        return new ColorHeader(scannerHead, paletteNumber, totalColors, companyName, paletteName, formatCode, protocol);
    }

    private String extractString(byte[] data, int start, int end) {
        String str = "";
        for (int i = start; i < end; i++) {
            str += data[i];
        }
        return str;
    }

    private Integer extractInteger(byte b1, byte b2) {
        int high = b1 & 0xff;
        int low = b2 & 0xff;
        return (high << 8) | low;
    }

    private Integer extractSmallInteger(byte b) {
        return b & 0xff;
    }

    private void setMaxMinValue(int x, int y, int z) {
        if (x > maxWidth) {
            maxWidth = x;
        }
        if (x < minWidth) {
            minWidth = x;
        }
        if (y > maxHeight) {
            maxHeight = y;
        }
        if (y < minHeight) {
            minHeight = y;
        }
        if (z > maxDepth) {
            maxDepth = z;
        }
        if (z < minDepth) {
            minDepth = z;
        }
    }
}
