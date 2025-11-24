/*
    Function: Generate Random ID
    Params:
        - len: Min (2), Max(11)
    Return: Random string of length len
*/
export const generateRandomId = (len: number) => {
    const randomStr = Math.random().toString(36).slice(2);

    return randomStr.slice(0, len);
}