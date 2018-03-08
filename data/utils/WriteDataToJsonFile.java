package utils;

import java.io.FileWriter;
import java.io.IOException;

public class WriteDataToJsonFile {

	public static void main(String[] args) {

		try {			 
             FileWriter writer=new FileWriter(args[0], false);
			 
			 String content = args[1];
			 content = content.replace("\\", "");
			 content = content.replace("{\"[", "");
			 content = content.replace("]\":\"\"", "");
			 content = content.replace("{[", "");
			 content = content.replace("]:}", "");
			 
             writer.write(content);
			 writer.close();         
        } catch (IOException e) {
            e.printStackTrace();
        }
	}
}