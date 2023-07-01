
export const globalErrHandler = (err,req,res,next)=>{
const stack = err?.stack
const message =err?.message
const status = err?.statusCode ? err?.statusCode:500
res.status(status).json({
    status,stack,message
})
} 

export const notFound = (req,res,next)=>{
    const err = new Error(`Route ${req.originalUrl} not found`)
    next(err)
}