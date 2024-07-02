// export async calculateDiscount(amount, discount) {

//     discount = discount ? discount : 0

//     var afterDiscount = amount - (amount * discount / 100);

//     return afterDiscount

//   }

export async function calculateDiscount(amount: number, discount: number) {
    discount = discount ? discount : 0

    var afterDiscount = amount - (amount * discount / 100);

    return afterDiscount
}