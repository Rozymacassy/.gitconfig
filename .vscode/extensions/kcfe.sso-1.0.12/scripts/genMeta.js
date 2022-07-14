const fs = require('fs');
const path = require('path');

const convertToMetaJson = (fileName) => {
    console.warn(fileName, 'processing');
    const fileJson = require(`../../docs/src/ui/src/markdown/mui/json/${fileName}`);
    const name = fileJson.title;
    const desc = fileJson.subtitle;
    const tips = fileJson.type;
    const demoImage = fileJson.cover;
    const docLink = '';
    let attrsTable = [];
    let attrsTbody = [];

    fileJson.body.children.forEach((item) => {
        if (item?.tag === 'table') {
            attrsTable.push(...item.children);
        }
    });

    attrsTable.forEach((item) => {
        if (item.tag === 'tbody') {
            attrsTbody.push(...item.children);
        }
    });

    const attrs = attrsTbody.map((item) => {
        const attr = {};
        attr.name = item?.children[0].children ? item.children[0].children[0] : '暂无';
        attr.type = {
            name: item?.children[2]
                ? item?.children[2].children
                    ? item.children[2].children[0]
                    : '暂无'
                : '暂无',
        };
        attr.desc = [item?.children[1].children ? item.children[1].children[0] : '暂无'];
        attr.defaultValue = item?.children[3]?.children ? item?.children[3]?.children[0] : '暂无';
        attr.enum = [];
        return attr;
    });
    return {
        name,
        desc,
        attrs,
        tips,
        demoImage,
        docLink,
    };
};

const mergeAllMetaData = () => {
    const metaData = {};
    const allFileList = fs.readdirSync(
        path.join(__dirname, '../../docs/src/ui/src/markdown/mui/json'),
    );
    console.log('一共%d个文件需要处理', allFileList.length);
    allFileList.forEach((item, index) => {
        const metaInfo = convertToMetaJson(item);
        metaData[metaInfo.name] = metaInfo;
        console.log('已处理%d个', index + 1);
    });
    fs.writeFileSync(path.join(__dirname, '../snippets/mui-meta.json'), JSON.stringify(metaData));
};

mergeAllMetaData();
