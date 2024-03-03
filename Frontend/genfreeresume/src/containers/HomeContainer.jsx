import React from "react";
import useTemplates from "../hooks/useTemplates";
import { Spinners, TemplateDesign } from "../components";
import { AnimatePresence } from "framer-motion";

const HomeContainer = () => {
  // maintaining the states of templates below. Refetch is used to fetch the latest state, here templates
  const {
    data: templates,
    isError: isTemplateError,
    isLoading: isTemplateLoading,
    refetch: templateRefetch,
  } = useTemplates();

  if (isTemplateLoading) {
    return <Spinners />;
  }

  return (
    <div className="w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
      {isTemplateError ? (
        <React.Fragment>
          <p className="text-lg text-txtDark">
            Something went wrong.. Please try again later
          </p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <RenderATemplate templates={templates} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
// Rendering each template from our current state of templates..
const RenderATemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 ? (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates.map((template, index) => (
                <TemplateDesign
                  key={template?.id}
                  data={template}
                  index={index}
                />
              ))}
          </AnimatePresence>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>No Data Found</p>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default HomeContainer;
