import {Auth, google} from "googleapis"
import core from "@actions/core"

const sheets = google.sheets("v4")

const sheetId = core.getInput("sheet_id")
const googleApiKey = JSON.parse(core.getInput("token"))

const range = "B80:B80"

const updateCell = async (auth: any) => {
    return await sheets.spreadsheets.values.update({
        auth: auth,
        spreadsheetId: sheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[Date.now()]]
        }
    })
}

const credentials = new Auth.JWT({
    email: googleApiKey.client_email,
    key: googleApiKey.private_key,
    scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets"
    ]
})

updateCell(credentials)
    .then(r => console.log(r.data))
    .catch(e => console.error(e))