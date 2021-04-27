export default function Page(page = null, action) {

    if (action.type === 'addPage') {
        return action.page
    }else{
        return page
    }
}