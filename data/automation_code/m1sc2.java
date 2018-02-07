import static com.jayway.restassured.RestAssured.given;
import org.junit.Test;

public class m1sc2 {

	@Test
	public void testMethod() {
		given().when().get("123");
given().when().get("789");
given().when().get("abc");

	}
}