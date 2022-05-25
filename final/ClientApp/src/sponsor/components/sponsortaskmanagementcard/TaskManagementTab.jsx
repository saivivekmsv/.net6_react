/* Component for displaying the tasks availble for the provider */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from '@fortawesome/pro-duotone-svg-icons';

const TaskManagement = (props) => {
    const { task } = props;
    return (

        <div className={`tasks d-flex flex-row w-100 justify-content-between align-items-center mb-3 ${task.type}`}>
            <div className="d-flex flex-column">
                <span>{task.description}</span>
                <span>{task.name}</span>
            </div>
            <FontAwesomeIcon icon={faChevronCircleRight} size="2x" />
        </div>
    )
}
export default TaskManagement;