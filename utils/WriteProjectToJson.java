package utils;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Random;

public class WriteProjectToJson {

	public static void main(String[] args) {

		try {
						String fileName = "data/projects.json";
            FileWriter writer=new FileWriter(fileName, true);

						Random random =  new Random();
						int randomNumber = random.nextInt(1000000);

            String content = new String(Files.readAllBytes(Paths.get(fileName))).trim();
            String dataToWrite = "{\"id\":\"" + randomNumber + "\"," + "\"firstName\":\"" + args[0] + "\"," + "\"lastName\":\"" + args[1] + "\"," + "\"email\":\"" + args[2] + "\"}";
            if(content.isEmpty()) {
            	writer.write("[" + dataToWrite +"]");
            }
            else{
            	writer.close();
            	File file = new File(fileName);
            	if (file.exists() && file.isFile())
            	  {
            	  file.delete();
            	  }
            	file.createNewFile();

							if(content.length() > 2){
									content = content.replaceAll("]", ",");
							}else{
								content = content.replaceAll("]", "");
							}

            	content+= dataToWrite + "]";
            	writer=new FileWriter(fileName);
            	writer.write(content);
            }

            writer.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
	}
}
