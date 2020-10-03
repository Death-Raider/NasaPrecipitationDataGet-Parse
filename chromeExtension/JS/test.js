let start = createData("20000601");
let end =   createData("20200430");
dateStart = new Date(start)
dateEnd = new Date(end)
//previous date
downloadURLs = []
totalDays = (new Date(dateEnd - dateStart)).getTime()/(1000*3600*24);

downloadURLs.push("https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/2000/06/3B-DAY.MS.MRG.3IMERG.20000601-S000000-E235959.V06.nc4")
for(let i = 0; i < totalDays; i++){
  dateStart.setDate(dateStart.getDate()+1)
  let updatedDate = formatDate(dateStart.toISOString());
  downloadURLs.push("https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/"+updatedDate.substr(0,4)+"/"+updatedDate.substr(4,2)+"/3B-DAY.MS.MRG.3IMERG."+updatedDate+"-S000000-E235959.V06.nc4")
}

downloadSequentially(downloadURLs, ()=>console.log("done!!"));

function downloadSequentially(urls, callback) {
  let index = 0;
  let currentId;

  chrome.downloads.onChanged.addListener(onChanged);

  next();

  function next() {
    if (index >= urls.length) {
      chrome.downloads.onChanged.removeListener(onChanged);
      callback();
      return;
    }
    const url = urls[index];
    index++;
    if (url) {
      chrome.downloads.download({
        url,
      }, id => {
        currentId = id;
      });
    }
  }

  function onChanged({id, state}) {
    if (id === currentId && state && state.current !== 'in_progress') {
      next();
    }
  }
}
function createData(str){
  return str.substr(0,4) + "-" + str.substr(4,2)+"-"+str.substr(6,2)
}
function formatDate(str){
  let value = (str.substr(0,10)).split("-")
  return value[0] + value[1] + value[2]
}
