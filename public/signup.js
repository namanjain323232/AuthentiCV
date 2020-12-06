const passvalueSignup = async (username, email, password, passwordConfirm, linkedin, github) => {
  alert("Extracting Profiles - It may take a couple of minutes");
   try {
     const result = await axios({
       method: "POST",
       url: "/api/v1/signup",
       data: {
         email,
         name: username,
         password,
         passwordConfirm,
         linkedin,
         github
       },
     });
     if (result.data.status === "success") {
       alert("Successful");
       window.setTimeout(() => {
         location.assign("/");
       }, 800);
     }
   } catch (err) {
     console.log(err);
     alert("Unsuccessful");
   }
 };
 
 document.getElementById("signupForm").addEventListener("submit", (e) => {
   e.preventDefault();
   const username = document.getElementById("username").value;
   const email = document.getElementById("email").value;
   const password = document.getElementById("password").value;
   const passwordConfirm = document.getElementById("cpassword").value;
   const linkedin = document.getElementById("linkedin").value;
   const github = document.getElementById("github").value;
   passvalueSignup(username, email, password, passwordConfirm, linkedin, github);
 });
 