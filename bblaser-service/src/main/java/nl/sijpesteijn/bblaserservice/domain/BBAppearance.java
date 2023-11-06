package nl.sijpesteijn.bblaserservice.domain;

import java.util.List;

public class BBAppearance {
    private Integer id;
    private Integer start;
    private Integer duration;
    private List<BBEffect> effects = List.of();

    public BBAppearance(Integer id, Integer start, Integer duration, List<BBEffect> effects) {
        this.id = id;
        this.start = start;
        this.duration = duration;
        this.effects = effects;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public List<BBEffect> getEffects() {
        return effects;
    }

    public void setEffects(List<BBEffect> effects) {
        this.effects = effects;
    }
}
