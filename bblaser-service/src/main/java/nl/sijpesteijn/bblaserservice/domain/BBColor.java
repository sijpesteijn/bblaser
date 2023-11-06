package nl.sijpesteijn.bblaserservice.domain;

public class BBColor {
    private final Integer red;
    private final Integer green;
    private final Integer blue;

    public BBColor(Integer red, Integer green, Integer blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    public Integer getRed() {
        return red;
    }

    public Integer getGreen() {
        return green;
    }

    public Integer getBlue() {
        return blue;
    }
}
