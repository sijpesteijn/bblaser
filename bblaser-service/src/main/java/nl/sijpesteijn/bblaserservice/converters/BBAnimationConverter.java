package nl.sijpesteijn.bblaserservice.converters;

import nl.sijpesteijn.bblaserservice.domain.*;
import nl.sijpesteijn.bblaserservice.domain.ilda.ColorData;
import nl.sijpesteijn.bblaserservice.domain.ilda.CoordinateData;
import nl.sijpesteijn.bblaserservice.domain.ilda.Ilda;
import nl.sijpesteijn.bblaserservice.domain.ilda.IldaFrame;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class BBAnimationConverter {
    public BBAnimation convert(Ilda ilda, String name) {
        List<BBElement> elements = getElements(ilda);
        BBAnimation bbAnimation = new BBAnimation();
        bbAnimation.setName(name);
        bbAnimation.setLast_update(Instant.now());
        bbAnimation.setElements(elements);
        return bbAnimation;
    }

    private List<BBElement> getElements(Ilda ilda) {
        List<BBElement> elements = new ArrayList<>();
        Long elementNr = 0l;
        Integer indent = 0;
        for(IldaFrame frame : ilda.getIldaFrames()) {
            BBAppearance appearance = new BBAppearance(0, indent * 500, 500, List.of());
            BBElement element = null;
            List<BBPoint> points = new ArrayList<>();
            for (CoordinateData coordinateData : frame.getCoordinateDataList()) {
                if (coordinateData.getBlanked()) {
                    if (element != null) {
                        elements.add(element);
                        element = null;
                    }
                } else {
                    if (element == null) {
                        points = new ArrayList<>();
                        ColorData colorData = coordinateData.getColorData();
                        BBLine line = new BBLine(points, new BBColor(colorData.getRed1(), colorData.getGreen1(), colorData.getBlue1()));
                        element = new BBElement(elementNr++, "Line " + elementNr, line, List.of(appearance));
                    }
                    BBPoint point = new BBPoint(coordinateData.getX() + 32768, 65534 - (coordinateData.getY() + 32767));
                    points.add(point);
                }
            }
            indent++;
        }
        return elements;
    }
}
