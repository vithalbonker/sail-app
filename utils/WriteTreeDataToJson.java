package utils;

import java.io.FileWriter;
import java.io.IOException;

public class WriteTreeDataToJson {

	public static void main(String[] args) {

		try {
			 String fileName = "data/tree.json";
             FileWriter writer=new FileWriter(fileName, false);            
			 
			 String content = args[0];
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