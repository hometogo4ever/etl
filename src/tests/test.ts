import ETLApiInstance from "../app/services/ETLApiInstance";

const test = async () => {
  const etlApiInstance = ETLApiInstance.getInstance();

  console.log("Initializing");
  //const initialized = await etlApiInstance.initialize();
  //console.log("Initialized", initialized);

  console.log("Logging in");
  await etlApiInstance.login("2023-15725", "SKmfITocGPdUAXsJBdAhgPM7YtypAOPK");
  console.log("Logged in");

  console.log("Getting courses");
  const courses = await etlApiInstance.getCourses();
  console.log(courses);
};

test();
