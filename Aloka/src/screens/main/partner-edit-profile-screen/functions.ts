export const isHasChangeLink = (arrNew: any, arrOld: any) => {
    let isChange = false;
    for (let i = 0; i < arrNew.length; i++) {
        if (arrNew[i]?.link != arrOld[i]?.link) {
            isChange = true;
            break;
        }
    }
    return isChange;
}

function checkIdExist(id: any, arr: any) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            return true;
        }
    }
    return false;
}

export const isHasChangeSpecial = (arrNew: any, arrOld: any) => {
    let isChange = false;
    for (let i = 0; i < arrNew.length; i++) {
        if (!checkIdExist(arrNew[i].id, arrOld)) {
            isChange = true;
            break;
        }
    }
    if (arrNew.length != arrOld.length && arrNew.length > 0) {
        isChange = true;
    }
    return isChange;
}