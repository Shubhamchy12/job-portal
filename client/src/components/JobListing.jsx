import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  assets,
  JobCategories,
  JobLocations,
  jobsApplied,
} from "../assets/assets";
import JobCart from "./JobCart";
import { useSearchParams } from "react-router-dom";

const JobListing = () => {
  const { isSearched, searchFilter, SetsearchFilter, jobs } =
    useContext(AppContext);

  const [showFilter, setshowFilter] = useState(false);

  const [currentPages, setcurrentPages] = useState(1);

  const [selectedCategories, setselectedcategories] = useState([]);

  const [selectedlocation, setselectedlocation] = useState([]);

  const [filterjob, setfilterjob] = useState(jobs);

  const handleCategoryChange = (category) => {
    setselectedcategories((prev) =>
      prev.includes(category)
        ? prev.fill((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setselectedlocation((prev) =>
      prev.includes(location)
        ? prev.fill((c) => c !== location)
        : [...prev, location]
    );
  };

  useEffect(() => {
    const matchesCategory = (job) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(job.category);

    const matchesLocation = (job) =>
      selectedlocation.length === 0 || selectedlocation.includes(job.location);

    const matchesTitle = (job) =>
      searchFilter.title === "" ||
      job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      searchFilter.location === "" ||
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilterJob = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchesCategory(job) &&
          matchesLocation(job) &&
          matchesTitle(job) &&
          matchesSearchLocation(job)
      );

    setfilterjob(newFilterJob);
    setcurrentPages(1);
  }, [jobs, selectedCategories, searchFilter, selectedlocation]);
  return (
    <div className="container flex flex-col py-8 mx-auto 2xl:px-20 lg:flex-row max-lg:space-y-8">
      {/* side bar */}

      <div className="w-full px-4 bg-white lg:w-1/4">
        {/* search filter from hero components */}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="mb-4 text-lg font-medium">Current Search</h3>
              <div className="mb-4 text-gray-600">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                    {searchFilter.title}
                    <img
                      onClick={(e) =>
                        SetsearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
                {searchFilter.location && (
                  <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                    {searchFilter.location}
                    <img
                      onClick={(e) =>
                        SetsearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
              </div>
            </>
          )}

        <button
          onClick={(e) => setshowFilter((prev) => !prev)}
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden"
        >
          {showFilter ? "close" : "Filters"}
        </button>

        {/* category filter */}

        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="py-4 text-lg font-medium">Search by Categories</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li className="flex items-center gap-3" key={index}>
                <input
                  className="scale-125"
                  type="checkbox"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* serach by location */}

        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="py-4 text-lg font-medium pt-14">Search by Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li className="flex items-center gap-3" key={index}>
                <input
                  className="scale-125"
                  type="checkbox"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedlocation.includes(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* job Listings */}
      <section className="w-full text-gray-800 lg:w-3/4 max-lg:px-4 ">
        <h3 className="py-2 text-3xl font-medium" id="job-list">
          Latest Jobs
        </h3>
        <p className="mb-8 ">Get your desired job from top companies</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filterjob
            .slice((currentPages - 1) * 6, currentPages * 6)
            .map((job, index) => (
              <JobCart key={index} job={job} />
            ))}
        </div>

        {/* pagination */}
        {filterjob.length > 0 && (
          <div className="flex items-center justify-center mt-10 space-x-2">
            <a href="#job-list">
              <img
                onClick={() => setcurrentPages(Math.max(currentPages - 1), 1)}
                src={assets.left_arrow_icon}
                alt=""
              />
            </a>
            {Array.from({ length: Math.ceil(filterjob.length / 6) }).map(
              (_, index) => (
                <a key={index} href="#job-list">
                  <button
                    onClick={() => setcurrentPages(index + 1)}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                      currentPages === index + 1
                        ? "bg-blue-100 text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </a>
              )
            )}
            <a  href="#job-list">
              <img
                onClick={() =>
                  setcurrentPages(
                    Math.min(currentPages + 1, Math.ceil(filterjob.length / 6))
                  )
                }
                src={assets.right_arrow_icon}
                alt=""
              />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
