package utils;

import java.io.*;

public class CreatemvnProject {
    public static void main(String[] args) throws Exception {
      try {
      //  ProcessBuilder builder = new ProcessBuilder(
        //    "cmd.exe", "/c", "cd \"D:\\1-Projects\\sail-app-master\\Projects\" && mvn archetype:generate -DgroupId=com."+ args[0] +"-DartifactId="+ args[0] +" -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false");
        ProcessBuilder builder = new ProcessBuilder(
              "cmd.exe", "/c", "cd \"D:\\1-Projects\\sail-app-master\\Projects\" && mvn archetype:generate -DgroupId=com.ex01 -DartifactId="+ args[0] +" -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false");
        builder.redirectErrorStream(true);
        Process p = builder.start();
        BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
        String line;
        while (true) {
            line = r.readLine();
            if (line == null) { break; }
            System.out.println(line);
        }
    }
   catch (IOException e) {
      e.printStackTrace();
  }
  System.out.println("Bharath Project::"+args[0]);
}
}
