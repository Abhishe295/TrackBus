import Bus from "../model/busModel.js";
import LiveSession from "../model/liveSessionModel.js";

export const getBusInfo = async (req, res) => {
  const busNumber = req.params.busNumber.trim().toUpperCase();

  const bus = await Bus.findOne({ busNumber });
  if (!bus) {
    return res.status(404).json({ success: false, message: "Bus not found" });
  }

  const session = await LiveSession.findOne({ busNumber });

  res.json({
    success: true,
    bus,
    session: session
      ? {
          lastLocation: session.lastLocation,
          path: session.path || [],
          active: session.active,
          confidence: session.confidence,
        }
      : null,
  });
};


export const getAllBuses = async(req,res)=>{
  try{
    const buses = await Bus.find({active: true}).select("busNumber routeName active").sort({busNumber: 1});

    res.json({
      success: true,
      count: buses.length,
      buses,
    });
  }catch(e){
    res.status(500).json({
      success: false,
      message: "Failed to fetch buses",
    })
  }
}

export const createBus = async(req,res)=>{
  try{
    let {busNumber, routeName} = req.body;
    if(!busNumber || !routeName){
      return res.status(400).json({
        success: false,
        message: "busNumber and routeName are required",
      })
    }
    busNumber = busNumber.trim().toUpperCase();
    routeName = routeName.trim();
    
    const existingBus = await Bus.findOne({busNumber});
    if(existingBus){
      return res.status(409).json({
        success: false,
        message: "Bus already exists",
      });
    }
    const bus  = await Bus.create({
      busNumber,routeName,
      active: true,
    });
  }catch(e){
    res.status(500).json({
      success: false,
      message: "Failed to create bus",
    })
  }
}


