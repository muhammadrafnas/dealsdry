const mongoose=require("mongoose")
const documentSchema=mongoose.Schema({
    name:{
        type:Array
    }
})
const documentsGstNo=mongoose.Schema({
    name:{
        type:Array
    }
})
const documentPartnership=mongoose.Schema({
    name:{
        type:Array
    }
})
const document =mongoose.model("documents",documentSchema)
const documentGstNo=mongoose.model("documentGstNo",documentsGstNo)
const documentsPartnership=mongoose.model("partnershipDoc",documentPartnership)
module.exports={
    docuemnt:document,
    documentGstNo:documentGstNo,
    partnerShipDoc:documentsPartnership
}