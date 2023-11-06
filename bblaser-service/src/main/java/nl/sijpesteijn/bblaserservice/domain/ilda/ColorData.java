package nl.sijpesteijn.bblaserservice.domain.ilda;

public class ColorData {
    private final Integer red1;
    private final Integer red2;
    private final Integer green1;
    private final Integer green2;
    private final Integer blue1;
    private final Integer blue2;
    private final Integer code;

    public ColorData(Integer red1, Integer red2, Integer green1, Integer green2, Integer blue1, Integer blue2, Integer code) {
        this.red1 = red1;
        this.red2 = red2;
        this.green1 = green1;
        this.green2 = green2;
        this.blue1 = blue1;
        this.blue2 = blue2;
        this.code = code;
    }

    public Integer getRed1() {
        return red1;
    }

    public Integer getRed2() {
        return red2;
    }

    public Integer getGreen1() {
        return green1;
    }

    public Integer getGreen2() {
        return green2;
    }

    public Integer getBlue1() {
        return blue1;
    }

    public Integer getBlue2() {
        return blue2;
    }

    public Integer getCode() {
        return code;
    }
}
