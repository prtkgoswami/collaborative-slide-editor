export const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#ec4899"];

/*
    Function: Get a Random Color using the Username
    Params:
        - name: username of user
    Return: Random color from the COLORS list
*/
export const getColor = (name: string) => {
  if (!name) return COLORS[0];
  const code = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return COLORS[code % COLORS.length];
};
