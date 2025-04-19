const UrlRepository=require('../repositories/urlRepositories');
const UserRepository=require('../repositories/userRepositories')


class UrlServices{

static async createUrl(urlData) {
    if(urlData.user_id){
        const user=await UserRepository.getUserById(urlData.user_id);
        if(!user){
            throw new Error('User not found');
        }
    }
    return UrlRepository.createUrl(urlData);

}
static async createRandomUrl(urlData) {
    if(urlData.user_id){
        const user=await UserRepository.getUserById(urlData.user_id);
        if(!user){
            throw new Error('User not found');
        }
    }
    return UrlRepository.createRandomUrl(urlData);
}
static async redirectToOriginalUrl(short_code) {
    return UrlRepository.redirectToOriginalUrl(short_code);

}
}
module.exports=UrlServices;