package nl.sijpesteijn.bblaserservice.domain.ilda;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

public class IldaColorTable {
    private Map<Integer, ColorData> colors = new HashMap<>();

    public IldaColorTable() {
        try {
            InputStream inputStream = this.getClass().getResourceAsStream("/ildaColorTable.csv");
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                String[] splits = line.split(" ");
                Integer code = Integer.valueOf(splits[0]);
                Integer red = Integer.valueOf(splits[1]);
                Integer green = Integer.valueOf(splits[2]);
                Integer blue = Integer.valueOf(splits[3]);

                colors.put(code, new ColorData(red, red, green, green, blue, blue, code));
            }
            bufferedReader.close();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }

    public ColorData getColor(Integer colorCode) {
        return colors.get(colorCode);
    }
}
