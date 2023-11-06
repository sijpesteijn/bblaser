package nl.sijpesteijn.bblaserservice.domain.ilda;

import java.util.List;

public class Ilda {
    private final Integer minWidth;
    private final Integer maxWidth;
    private final Integer minHeight;
    private final Integer maxHeight;
    private final Integer minDepth;
    private final Integer maxDepth;
    private final ColorHeader colorHeader;
    private final List<IldaFrame> ildaFrames;
    private final List<ColorData> colorDataList;

    public Ilda(Integer minWidth, Integer maxWidth, Integer minHeight, Integer maxHeight, Integer minDepth, Integer maxDepth,
                ColorHeader colorHeader, List<IldaFrame> ildaFrames, List<ColorData> colorDataList) {
        this.minWidth = minWidth;
        this.maxWidth = maxWidth;
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
        this.minDepth = minDepth;
        this.maxDepth = maxDepth;
        this.colorHeader = colorHeader;
        this.ildaFrames = ildaFrames;
        this.colorDataList = colorDataList;
    }

    public Integer getMinWidth() {
        return minWidth;
    }

    public Integer getMaxWidth() {
        return maxWidth;
    }

    public Integer getMinHeight() {
        return minHeight;
    }

    public Integer getMaxHeight() {
        return maxHeight;
    }

    public Integer getMinDepth() {
        return minDepth;
    }

    public Integer getMaxDepth() {
        return maxDepth;
    }

    public ColorHeader getColorHeader() {
        return colorHeader;
    }

    public List<IldaFrame> getIldaFrames() {
        return ildaFrames;
    }

    public List<ColorData> getColorDataList() {
        return colorDataList;
    }
}
