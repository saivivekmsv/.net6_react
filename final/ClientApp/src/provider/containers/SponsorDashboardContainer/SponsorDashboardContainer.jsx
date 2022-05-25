import React from "react";
import SponsorLoanInformationCard from "../../components/SponsorCards/SponsorLoanInformationCard";
import SponsorTaskManagementCard from "../../components/SponsorCards/SponsorTaskManagementCard";
import SponsorPerformanceIndicesCard from "../../components/SponsorPerformaceIndicesCard/SponsorPerformanceIndicesCard";
import SponsorCompanyCard from "../../components/SponsorCompanyCard/SponsorCompanyCard";
import "../../styles/components/SponsorCard.scss";
import SponsorCarouselCard from "../../components/SponsorCards/SponsorCarouselCard";
const SponsorDashboardContainer = (props) => {
    return (

        <div className="flex-row w-100 p-3 " style={{ backgroundColor: '#e5e5e5' }}>
            <div style={{ marginRight: '20px' }}><SponsorCompanyCard /></div>
            <div className="disp-flex-col w-100">


                <div className="flex-row w-100">
                    <div className="disp-flex-col">
                        <div style={{ marginRight: '20px' }}><SponsorLoanInformationCard /></div>
                        <div style={{ marginTop: '20px' }}><SponsorCarouselCard /></div>
                    </div>
                    <div style={{ marginBottom: '20px' }}><SponsorTaskManagementCard style={{ marginBottom: '20px' }} /></div>
                </div>
                <div className="mr-3" style={{ width: '812px', height: '428px' }}><SponsorPerformanceIndicesCard /></div>
            </div>
        </div>

    );
};

export default SponsorDashboardContainer;