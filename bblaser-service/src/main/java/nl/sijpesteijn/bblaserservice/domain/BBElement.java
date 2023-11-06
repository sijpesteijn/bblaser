package nl.sijpesteijn.bblaserservice.domain;

import java.util.List;

public class BBElement {
    private final Long id;
    private final String name;
    private final BBShape shape;
    private final List<BBAppearance> appearances;

    public BBElement(Long id, String name, BBShape shape, List<BBAppearance> appearances) {
        this.id = id;
        this.name = name;
        this.shape = shape;
        this.appearances = appearances;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BBShape getShape() {
        return shape;
    }

    public List<BBAppearance> getAppearances() {
        return appearances;
    }
}
