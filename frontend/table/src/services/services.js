const getResource = async (url) => {
    const res = await fetch(`http://37.77.106.103/api${url}`);
    
    if (!res.ok) {
        throw new Error(`Couldn't fetch ${url}, status ${res.status}`);
    }

    return await res.json();
}

export const getCourses = async () => {
    const res = await getResource('/courses/all');
    return res;
}

export const getChilds = (connections, parent_id) => {
    const childs = connections.entities_connections
        .filter(connection => connection.parent_id === parent_id)
        .map(connection => connection.child_id);
    return childs;
}

export const getParents = (connections, child_id) => {
    const parents = connections.entities_connections
        .filter(connection => connection.child_id === child_id)
        .map(connection => connection.parent_id);
    return parents;
}

export const getItems = (data, childs, className) => {
    const items = [];
    childs.forEach((child, index) => {
        items.push(<div className={className + " secondary-column-element"} key={index}>{ data[child].name }</div>);
    });
    return items;
}

export const wrapName = (name, className) => <div className={className + " first-column-element"} title={ name }>{ name }</div>;

export const getSearchingElement = (initData, query) => {
    return initData.filter(item => {
        if (query === "") {
            return item;
        } else if (item.name.toLowerCase().trim().includes(query.toLowerCase().trim())) {
            return item;
        } else return null;
    });
}

export const comparePriority = (a, b) => {
    if (a.trim().toLowerCase() > b.trim().toLowerCase()) {
        return 1;
    } else {
        return -1;
    }
};

export const addLabels = () => {
    const checkboxes = document.querySelectorAll('.table_container tbody td:first-child input[type="checkbox"]');
    const tds = document.querySelectorAll('.table_container tbody td:first-child');
    if (checkboxes === null || tds === null) { return; }
    checkboxes.forEach((checkbox, index) => checkbox.setAttribute('id', `checkbox${index}`));
    tds.forEach((td, index) => {
        const labels = document.querySelectorAll(`label[for="checkbox${index}"]`);
        if (labels.length > 1) {
            td.removeChild(labels[1]);
        } else {
            const label = document.createElement('label');
            label.setAttribute('class', 'label');
            label.setAttribute('for', `checkbox${index}`);
            td.appendChild(label);
        }
    })
}

/* export const getCheckedValues = (className) => {
    const values = [];
    const checkboxes = document.getElementsByTagName('input');
    const namesCourses = document.getElementsByClassName(className);
    for ( var i = 0; i < checkboxes.length; i++ ) {
        if (checkboxes[i].checked) {
            values.push(namesCourses[i].innerHTML);
        }
    }
    return values;
} */