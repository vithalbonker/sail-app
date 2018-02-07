import static com.jayway.restassured.RestAssured.given;
import org.junit.Test;

public class sc106 {

	@Test
	public void testMethod() {
		given().when().get("http://www.google.com");

	}
}