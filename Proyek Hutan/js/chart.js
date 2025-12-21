let grafikData = [];

function updateGrafik(v){
  grafikData.push(v);
  const c = document.getElementById("grafik");
  const ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);

  ctx.beginPath();
  ctx.moveTo(0, c.height - grafikData[0]);
  grafikData.forEach((val,i)=>{
    ctx.lineTo(i*40, c.height - val);
  });
  ctx.stroke();
}
