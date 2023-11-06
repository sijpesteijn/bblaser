package nl.sijpesteijn.bblaserservice.domain.ilda;

import java.util.List;

public class IldaFrame {
    private final String protocol;
    private final Boolean threeD;
    private final String frameName;
    private final String companyName;
    private final Integer totalPoints;
    private final Integer frameNumber;
    private final Integer totalFrames;
    private final Integer scannerHead;
    private final List<CoordinateData> coordinateDataList;

    public IldaFrame(String protocol, Boolean threeD, String frameName, String companyName, Integer totalPoints, Integer frameNumber, Integer totalFrames, Integer scannerHead, List<CoordinateData> coordinateDataList) {

        this.protocol = protocol;
        this.threeD = threeD;
        this.frameName = frameName;
        this.companyName = companyName;
        this.totalPoints = totalPoints;
        this.frameNumber = frameNumber;
        this.totalFrames = totalFrames;
        this.scannerHead = scannerHead;
        this.coordinateDataList = coordinateDataList;
    }

    public String getProtocol() {
        return protocol;
    }

    public Boolean getThreeD() {
        return threeD;
    }

    public String getFrameName() {
        return frameName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public Integer getFrameNumber() {
        return frameNumber;
    }

    public Integer getScannerHead() {
        return scannerHead;
    }

    public List<CoordinateData> getCoordinateDataList() {
        return coordinateDataList;
    }

    public Integer getTotalFrames() {
        return totalFrames;
    }
}
