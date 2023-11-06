package nl.sijpesteijn.bblaserservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "animations")
public class BBAnimation {
    @Id
    private String id;
    private String name;
    private Instant last_update;
    private List<BBElement> elements = List.of();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getLast_update() {
        return last_update;
    }

    public void setLast_update(Instant last_update) {
        this.last_update = last_update;
    }

    public List<BBElement> getElements() {
        return elements;
    }

    public void setElements(List<BBElement> elements) {
        this.elements = elements;
    }
}
