const passvalueLogin = async (email, password) => {
   try {
     const result = await axios({
       method: "POST",
       url: "/api/v1/login",
       data: {
         email,
         password,
       },
     });
     if (result.data.status === "success") {
       alert("Successful");
       window.setTimeout(() => {
         location.assign("/");
       }, 800);
     }
   } catch (err) {
     alert("Unsuccessful");
   }
 };
 
 document.getElementById("loginForm").addEventListener("submit", (e) => {
   e.preventDefault();
   const email = document.getElementById("email").value;
   const password = document.getElementById("password").value;
   passvalueLogin(email, password);
 });
 