package PACKAGE_NAME;

import com.albertsons.apiautomation.apiTestFramework.common.GETCallWrapper;
import com.albertsons.apiautomation.apiTestFramework.common.Generic;
import com.albertsons.apiautomation.j4uAPI.automation.base.ConfigTestBase;
import com.albertsons.apiautomation.j4uAPI.automation.common.AppGeneric;
import com.albertsons.apiautomation.j4uAPI.automation.common.DataExtractor;
import com.albertsons.apiautomation.j4uAPI.automation.constants.GlobalConstants;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.*;

public class sc2 extends ConfigTestBase{

	public GETCallWrapper getCallWrapper = null;
    public DataExtractor dataExtractor = null;
    public GlobalConstants globalConstants = null;
    public RestAssured restAssuredObj = new RestAssured();
    public String testScriptName = null;
    public Integer statusCode = null;
    public String responseDetails = null;
    private Generic generic = null;
    private AppGeneric appGeneric = null;
    public JSONArray currentTSDataRowsJSONArray = null;
    public Map<String, String> queryParams = new HashMap<String, String>();
    public Map<String, String> headersParams = new HashMap<String, String>();
    public Map<String, String> pathParams = new HashMap<String, String>();
    List<String> pathParamsNames = new ArrayList<String>();
    public JSONObject tokenJSONDataObj = null;
    public Response response = null;
    
	private String [] keysList1 = null;
	private String [] keysList2 = null;
	private String [] keysList3 = null;
	private String [] keysList4 = null;
	private String [] keysList5 = null;
	
	private String [] valuesList1 = null;
	private String [] valuesList2 = null;
	private String [] valuesList3 = null;
	private String [] valuesList4 = null;
	private String [] valuesList5 = null;

    @BeforeMethod
    public void initializeDataExtractor() throws Exception {
        getCallWrapper = new GETCallWrapper();
        dataExtractor = new DataExtractor();
        globalConstants = new GlobalConstants();
        generic = new Generic();
        appGeneric = new AppGeneric();
        testScriptName = this.getClass().getSimpleName();
        currentTSDataRowsJSONArray = dataExtractor.getJSONParseTestData(GlobalConstants.testEnvironment,GlobalConstants.EmjuCoreServices.GETCATEGORIESAPI.toString(),testScriptName);
    }

	@Test
	public void sc2() throws Exception{
	
		Iterator testScriptIterator = currentTSDataRowsJSONArray.iterator();
        while (testScriptIterator.hasNext()){
            Object keyObj = testScriptIterator.next();
            globalConstants.currentTSDataRowJSONObj = (JSONObject) keyObj;
            if(globalConstants.currentTSDataRowJSONObj.get("execute").toString().equalsIgnoreCase("yes")){			
			
				pathParams.put("pp2",globalConstants.currentTSDataRowJSONObj.get("pp2").toString());

				
				restAssuredObj.baseURI = globalConstants.currentTSDataRowJSONObj.get("uri").toString();                

                appGeneric.assignDetails("Test Script Name: " + testScriptName , "This Test is Currently Runs on API - " + GlobalConstants.EmjuCoreServices.GETCATEGORIESAPI.toString()
                        +","+"Current Test Environment:-" + GlobalConstants.testEnvironment + "," + "Current Test API BasePath:=" + restAssuredObj.baseURI.toString(), "Unable to Run the Test");
                appGeneric.generateExtentReport(GlobalConstants.ReportStatus.INFO.toString(), testScriptName);
				
				response = getCallWrapper.getAsResponse(restAssuredObj.baseURI,queryParams,pathParams,headersParams,GlobalConstants.GetCallArgs.QUERYPARAM.toString(),pathParamsNames);
				responseDetails = response.getBody().asString();

				statusCode = response.getStatusCode();
				appGeneric.assignDetails("Verify Service Call Status Code", "Service Call is Successful - StatusCode:-" + statusCode, "Service Call Error " + responseDetails);
				Assert.assertEquals(generic.verifyStatusCode(statusCode), Integer.parseInt("201"),"Service Call Error " + responseDetails);
				appGeneric.generateExtentReport(GlobalConstants.ReportStatus.PASS.toString(), testScriptName);

				
			}else {
                if (currentTSDataRowsJSONArray.size()>1){
                    appGeneric.assignDetails("Test Script Name: " + testScriptName , "This Test Script row is currently not set for Execution , hence Skipping Execution.....", "Unable to Run the Test");
                    appGeneric.generateExtentReport(GlobalConstants.ReportStatus.INFO.toString(), testScriptName);
                }else {
                    appGeneric.assignDetails("Test Script Name: " + testScriptName , "This Test Script is currently not set for Execution , hence Skipping Execution.....", "Unable to Run the Test");
                    appGeneric.generateExtentReport(GlobalConstants.ReportStatus.SKIP.toString(), testScriptName);
                }

            }

        }

    }
}