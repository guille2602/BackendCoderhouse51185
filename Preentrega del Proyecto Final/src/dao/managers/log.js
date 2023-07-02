import fs from "fs";

export default class Log {
    static url = "./log.txt";

    async record(content) {
        if (fs.existsSync) {
            fs.appendFile(url, content, (error) => {
                console.log("Error al actualizar" + error);
            });
        } else {
            fs.writeFile(url, content, (error) => {
                console.log("Error, al escribir el archivo" + error)
            })
        }
    }
}
