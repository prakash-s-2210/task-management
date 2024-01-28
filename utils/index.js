export function isValidDueDate(dateString) {
  const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = dateString.match(regex);

  if (match) {
    const [_, p1, p2, p3] = match;
    let year, month, day;
    [day, month, year] = [p1, p2, p3].map(Number);

    // Create the dueDate in UTC
    const dueDate = new Date(Date.UTC(year, month - 1, day));

    // Compare in the same time zone (UTC)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    return dueDate >= todayUTC;
  }
  return false;
}

export function calculatePriority(dateString){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    let dueDate = new Date(dateString);  
    let diffDays = Math.ceil((dueDate - todayUTC) / (1000 * 3600 * 24));
    if(diffDays < 1){
        return 0;
    }

    else if(diffDays === 1 || diffDays === 2){
        return 1;
    }

    else if(diffDays === 3 || diffDays === 4){
        return 2;
    }

    else{
        return 3;
    }
    
}

export function parseDate(ddmmyyyy) {
  const parts = ddmmyyyy.split("-");
  const day = parts[0]; 
  const month = parts[1]; 
  const year = parts[2];
  const formattedDate = `${year}-${month}-${day}`;
  return new Date(formattedDate);;
}

