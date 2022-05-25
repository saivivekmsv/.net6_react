import React, { useState } from "react";
import { ManageMapperLayout } from "../../../../shared/components";
import SourceContainer from "./SourceContainer";
import TargetContainer from "./TargetContainer";
import { DragDropContext } from "react-beautiful-dnd";
import sampleData from "./sampleData";
import { get } from "lodash";
const columns = {
  source: {
    id: "source-container",
    title: "sorce",
    data: sampleData,
  },
};

const PersonnalInformations = [
  {
    label: "Employee ID",
    length: 15,
    dataType: "string",
    mandatory: true,
    data: {},
  },
  {
    label: "SSN",
    length: 15,
    dataType: "string",
    mandatory: true,
    data: {},
  },
  {
    label: "RK Plan Number",
    length: 15,
    dataType: "string",
    mandatory: false,
    data: {},
  },
  {
    label: "First Name",
    length: 50,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "Middle Name",
    length: 50,
    dataType: "string",
    mandatory: false,
  },
  {
    label: "Last Name",
    length: 50,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "Gender",
    length: 15,
    dataType: "string",
    mandatory: false,
  },

  {
    label: "Marital Status",
    length: 15,
    dataType: "string",
    mandatory: false,
  },
  {
    label: "Birth Date",
    length: 15,
    dataType: "date",
    mandatory: false,
  },
];

const MapperContainer = (props) => {
  const [characters, setCharacters] = useState(sampleData);
  const [moved, setMoved] = useState({});
  const [dragStart, setDrag] = useState(false);
  const [dest, setDestination] = useState("");
  const [mapped, setMapped] = useState("");
  const [PersonnalInformation, setPersonnalInformation] = useState(
    PersonnalInformations
  );
  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
    },
    {
      label: "Next",
      variant: "primary",
      type: "submit",
    },
  ];

  const handleOnDragStart = () => {
    setDrag(true);
  };

  const handleOnDragEnd = (result) => {
    setDrag(false);
    const { source, destination } = result;
    console.log(result);

    // if (source.droppableId === destination.droppableId) {
    //   return;
    // }
    if (!result.destination) {
      setDestination("");
      return;
    }

    const info = PersonnalInformation.map((f) => {
      if (f.label == destination.droppableId) {
        setDestination(destination.droppableId);
        console.log("i am in");
        setMapped(result.draggableId);
        return {
          label: f.label,
          length: f.length,
          dataType: f.dataType,
          mandatory: f.mandatory,
          data: sampleData.filter((g) => g.field == result.draggableId),
        };
      }
      return f;
    });

    console.log(info, "infos");
    setPersonnalInformation(info);
  };
  console.log(moved, "moved");

  return (
    <ManageMapperLayout buttons={buttons}>
      <DragDropContext
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
      >
        <div className="mapper-container">
          <SourceContainer
            column={get(columns, "source.id")}
            characters={characters}
            mapped={mapped}
          />
          <TargetContainer
            destination={dest}
            PersonnalInformation={PersonnalInformation}
            dragStart={dragStart}
          />
        </div>
      </DragDropContext>
    </ManageMapperLayout>
  );
};

export default MapperContainer;
