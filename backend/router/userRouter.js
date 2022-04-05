const express = require("express")
const router = express.Router()
const { sendOtp, verificationOtp } = require("../utils/otp")
const userController = require("../controller/userController")
const { cloudinary } = require('../utils/cloudinary')
const {sendverficationEmail} =require("../utils/nodeMailer")


// send OTP api
router.post("/sendOtp", async (req, res) => {
   let phoneExist = await userController.checkPhone(req.body.phoneNumber)
   console.log(phoneExist);
   if (phoneExist.status) {
      res.json({ message: "Phone number verfication already done", userData: phoneExist.user })
   }
   else {
      let response = await sendOtp(req.body.phoneNumber)
      if (response) {
         res.status(200).send({
            message: "OTP send successfully "
         })
      }
      else {
         res.status(501).send({
            message: "Please check your mobile number"
         })
      }
   }
})
// otp verfication api
router.post("/otpVerification", async (req, res) => {
   let response = await verificationOtp(req.body.otp)
   if (response.status) {
      let user = await userController.doSignupPhone(response.phoneNumber)
      if (user) {
         res.json({ message: "Successfully verified mobile number", userDetails: user })
      }
   }
   else {
      res.status(501).send({
         message: "Enter valid OTP"
      })
   }
})
// get email and password and refferal code api
router.post("/email", async (req, res) => {
   let response = await userController.registrationEmail(req.body)
   if (response.status) {
      res.status(200).send({
         message: "Successfully added email and password"
      })
   }
   else {
      res.status(501).send({
         message: "Somthing wrong!"
      })
   }
})
// GSTIN confirmation
router.post("/gstinYes", async (req, res) => {
   console.log(req.body);
   try {
      let fileStr = req.body.gstinProof;
      const uploadedResponse = await cloudinary.uploader.
         upload(fileStr)
      req.body.gstinProof = uploadedResponse.secure_url
   }
   catch (error) {
      console.error(error);
   }
   let data = await userController.registrationGstYes(req.body)
   if (data) {
      res.status(200).send({
         message: "Successfully added "
      })
   }
})
// select category
router.post("/selectCategory", async (req, res) => {
   let response = await userController.registrationSelectCategory(req.body.category, req.body.userId)
   if (response) {
      res.status(200).send({
         message: "Successfully added "
      })
   }
})
// Business details
router.get("/businessDetails", async (req, res) => {
   let businessDetails = await userController.getBusinessDetials()
   if (businessDetails) {
      res.json(businessDetails)
   }
})
// Business details contact perosn is diffrent
router.get("/businessDetailsDiffrent", async (req, res) => {
   let businessDetails = await userController.getBusinessDetialsDiffrent()
   if (businessDetails) {
      res.json(businessDetails)
   }
})
//List and guidlines
router.get("/guidelinesDocuments", async (req, res) => {
   let documents = await userController.getDocuments()
   if (documents) {
      res.json(documents)
   }
})
//Business address for billing
router.post("/businessAddress", async (req, res) => {
   console.log("api....");
   console.log(req.body);
   let response = await userController.businessAddress(req.body,req.body.userId)
   if (response) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})
// business address for shipping
router.post("/businessAddressShipping", async (req, res) => {
   let response = await userController.businessAddressShipping(req.body,req.body.userId)
   if (response) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})
// upload documents
router.post("/uploadDocuments", async (req, res) => {
   let docuemnt = await userController.uploadDocument(req.body,req.body.userId)
   if (docuemnt) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})
//Registration With Pendency document
router.get("/pendencyDocument", async (req, res) => {
   let response = await userController.getPendencyDocument(req.query.id)
   if (response) {
      res.json(response)
   }
})
// whatsapp subscription
router.get("/whatsappSubscription", async (req, res) => {
   let response = await userController.whatsappSubscription(req.query.userId)
   if (response) {
      res.status(200).send({
         message: "Whatsapp subscription successfully"
      })
   }
})
// email verfication
router.get("/emailVerification",async(req,res)=>{
   console.log("call api...");
   let response=await userController.getEmail(req.query.userId)
   console.log(response.email);
   if(response){
      let email=  sendverficationEmail(response._id, response.email)
      res.status(200).send({
         message:"Verfication link send to your email "
      })
   }

})
// verfiy
router.get("/verify/:id/:uniqueString",async(req,res)=>{
   let data=await userController.emailVerified(req.params.id)
   if(data){
      res.status(200).send({
         message:"Email verified"
      })
   }
})
//get business type
router.get("/businessType", async (req, res) => {
   let response = await userController.businessType(req.body)
   if (response) {
      res.status(200).send({
         message: "Successfully added"
      })
   }
})
// reach to home screen as a guest
router.get("/home",(req,res)=>{
   res.status(200).send({ 
      message:"Successfully enter to home screen"
   })
})

// journey 2 for registration
//email and password
router.post("/gstNoemail",async(req,res)=>{
   let response=await userController.registrationEmailGstNo(req.body)
   if(response){
      res.status(200).send({
         message:"Successfully added email and password "
      })
   }
})
//fetch referral code
router.get("/referralCode",async(req,res)=>{
    res.json({message:"Referral code",code:"12345678"})
})
//gst no 
router.post("/gstinNo",async(req,res)=>{
   let response=await userController.gstNo(req.body)
   if(response){
      res.status(200).send({
         message:"Successfully added"
      })
   }
})
//list and guidline
router.get("/guidelinesDocumentsGstNo",async(req,res)=>{
     let data=await userController.getDocumentsGstNo()
     if(data){
        res.json(data)
     }
})
// upload documents gstNo
router.post("/uploadDocumentsGstNo",async(req,res)=>{
   let data=await userController.uplodDocumentsGstNo(req.body)
   if(data){
      res.status(200).send({
         message:"Successfully added"
      })
   }
})
// pendency document gstNo
router.get("/pendencyDocument",async(req,res)=>{
   let data=await  userController.getPendencyDocumentGstNo(req.query.userId)
   if(data){
      res.json(data)
   }
})
module.exports = router;