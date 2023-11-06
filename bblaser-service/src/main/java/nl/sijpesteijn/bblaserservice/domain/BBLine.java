package nl.sijpesteijn.bblaserservice.domain;

import java.util.List;

public class BBLine implements BBShape {
    private final List<BBPoint> points;
    private final BBColor color;

    public BBLine(List<BBPoint> points, BBColor color) {
        this.points = points;
        this.color = color;
    }

    public BBColor getColor() {
        return color;
    }

    public List<BBPoint> getPoints() {
        return points;
    }
}
