
const check = (user_id: any, arrTemp: any) => {
    for (let i = 0; i < arrTemp.length; i++) {
        if (user_id == arrTemp[i].user_id) {
            return i;
        }
    }
    return -1;
}

// Kiem tra co thuoc danh sach list result chua
const checkEmoij = (emoijId: number, arrEmoij: any) => {
    for (let i = 0; i < arrEmoij.length; i++) {
        if (emoijId == arrEmoij[i].emoji_id) {
            return i;
        }
    }
    return -1;
}

export const convertData = (listEmoji: any) => {
    let arrTemp = [];
    for (let i = 0; i < listEmoji.length; i++) {
        var obj = listEmoji[i];
        let isMatchIndex = check(obj.user_id, arrTemp);
        if (isMatchIndex == -1) {
            arrTemp.push({
                user_id: obj.user_id,
                listEmoij: [{ emoji_id: obj.emoji_id, number: 1, listEmoij_full: listEmoji }],
                numberEmoji: 1,
            })
        } else {
            arrTemp[isMatchIndex].numberEmoji += 1;
            let isMatchEmojiId = checkEmoij(obj.emoji_id, arrTemp[isMatchIndex].listEmoij);
            if (isMatchEmojiId == -1) {
                arrTemp[isMatchIndex].listEmoij.push({
                    emoji_id: obj.emoji_id,
                    listEmoij_full: listEmoji,
                    number: 1
                });
            } else {
                arrTemp[isMatchIndex].listEmoij[isMatchEmojiId].number += 1;
            }
        }

    }
    return arrTemp;
}


export const convertMemberLikeInfo = (listResult: any, listMember: any) => {
    let arrTemp = [...listResult];
    for (let i = 0; i < listResult.length; i++) {
        let userId = listResult[i].user_id;
        for (let j = 0; j < listMember.length; j++) {
            if (listMember[j].id == userId) {
                arrTemp[i].avatar = listMember[j].avatar;
                arrTemp[i].full_name = listMember[j].full_name;
                break;
            }
        }
    }
    return arrTemp;
}