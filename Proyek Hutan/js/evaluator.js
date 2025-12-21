function evaluasiAI(data){
  if(data.ekonomi > 80 && data.lingkungan < 40)
    return "AI Evaluator: Kebijakan eksploitatif dan tidak berkelanjutan.";

  if(data.lingkungan > 70 && data.ekonomi < 50)
    return "AI Evaluator: Kebijakan ekologis kuat namun berisiko ekonomi.";

  return "AI Evaluator: Kebijakan relatif seimbang dan berkelanjutan.";
}
