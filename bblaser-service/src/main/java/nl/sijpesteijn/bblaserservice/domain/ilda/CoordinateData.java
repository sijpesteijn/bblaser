package nl.sijpesteijn.bblaserservice.domain.ilda;

public class CoordinateData {
    private final Integer x;
    private final Integer y;
    private final Integer z;
    private final ColorData colorData;
    private final Boolean blanked;
    private final Boolean endImageDate;

    public CoordinateData(Integer x, Integer y, Integer z, ColorData colorData, Boolean blanked, Boolean endImageDate) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.colorData = colorData;
        this.blanked = blanked;
        this.endImageDate = endImageDate;
    }

    public Integer getX() {
        return x;
    }

    public Integer getY() {
        return y;
    }

    public Integer getZ() {
        return z;
    }

    public ColorData getColorData() {
        return colorData;
    }

    public Boolean getBlanked() {
        return blanked;
    }

    public Boolean getEndImageDate() {
        return endImageDate;
    }

}
