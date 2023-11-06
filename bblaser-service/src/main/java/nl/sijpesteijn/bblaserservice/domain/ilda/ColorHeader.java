package nl.sijpesteijn.bblaserservice.domain.ilda;

public class ColorHeader {
    private final Integer scannerHead;
    private final Integer paletteNumber;
    private final Integer totalColors;
    private final String companyName;
    private final String paletteName;
    private final Integer formatCode;
    private final String protocol;

    public ColorHeader(Integer scannerHead, Integer paletteNumber, Integer totalColors, String companyName, String paletteName, Integer formatCode, String protocol) {
        this.scannerHead = scannerHead;
        this.paletteNumber = paletteNumber;
        this.totalColors = totalColors;
        this.companyName = companyName;
        this.paletteName = paletteName;
        this.formatCode = formatCode;
        this.protocol = protocol;
    }

    public Integer getScannerHead() {
        return scannerHead;
    }

    public Integer getPaletteNumber() {
        return paletteNumber;
    }

    public Integer getTotalColors() {
        return totalColors;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getPaletteName() {
        return paletteName;
    }

    public Integer getFormatCode() {
        return formatCode;
    }

    public String getProtocol() {
        return protocol;
    }
}
