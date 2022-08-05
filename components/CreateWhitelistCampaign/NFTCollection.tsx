import { defaultTo } from "ramda";
import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const emptyCollection: Campaign.SpecificCollection = {
  nft: {
    contract_address: "",
    collection: {
      name: "",
      link: "",
    },
  },
  use_discord: false,
  discord: {
    name: "",
    role_id: "",
  },
};

const NFTCollection = () => {
  const [collections, setCollection] = useState<Campaign.SpecificCollection[]>([
    emptyCollection,
  ]);
  const { register, control } = useFormContext<Campaign.Form>();
  const form = useWatch({
    control,
  });

  const handleAddCollection = () => {
    setCollection((pre) => [...pre, emptyCollection]);
  };

  const handleRemove = (index: number) => {
    setCollection((prev) => prev.filter((e, i) => i !== index));
  };

  return (
    <>
      <div id="data_posts">
        {collections.map((e, index) => (
          <div key={index} className="add-collection-block row-data">
            <div className="row g-3">
              <div className="col-sm">
                <label htmlFor="formFileSm" className="form-label">
                  NFT Contract Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register(
                    `requirements.wallet.collections.${index}.nft.contract_address`
                  )}
                  placeholder="ie. 0xbc4ca0eda7647a8ab7c2061"
                  aria-label="ie. 0xbc4ca0eda7647a8ab7c2061"
                />
              </div>
              <div className="col-sm">
                <label htmlFor="formFileSm" className="form-label">
                  NFT Collection Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register(
                    `requirements.wallet.collections.${index}.nft.collection.name`
                  )}
                  placeholder="ie. Bored Ape Yatch Club"
                  aria-label="ie. Bored Ape Yatch Club"
                />
              </div>
              <div className=" col-sm">
                <label htmlFor="formFileSm" className="form-label">
                  NFT Collection Link
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register(
                    `requirements.wallet.collections.${index}.nft.collection.link`
                  )}
                  placeholder="ie. https://opensea.io/colle"
                  aria-label="ie. https://opensea.io/colle"
                />
              </div>
              <a
                onClick={() => handleRemove(index)}
                role="button"
                className="delete-record collection-trash"
              >
                <i className="fa-solid fa-trash-can"></i>
              </a>
            </div>

            <div className="form-check mt20">
              <input
                className="form-check-input "
                type="checkbox"
                {...register(
                  `requirements.wallet.collections.${index}.use_discord`
                )}
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                <div className="form-check-info">
                  <h4>Use Discord as an alternative proof of ownership</h4>
                  <p>
                    If the user doesn’t have a wallet with this NFT, we will
                    look for a holder role in your Discord Server to verify
                    ownership.
                  </p>
                </div>
              </label>
            </div>
            {defaultTo(false)(
              form.requirements?.wallet?.collections[index]?.use_discord
            ) && (
              <div className="role-display">
                <div className="row g-3">
                  <div className="col-sm-7">
                    <label htmlFor="formFileSm" className="form-label">
                      Role Display name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      {...register(
                        `requirements.wallet.collections.${index}.discord.name`
                      )}
                      placeholder="The Stray Cat Original Gang"
                      aria-label="The Stray Cat Original Gang"
                    />
                  </div>
                  <div className="col-sm-5">
                    <label htmlFor="formFileSm" className="form-label">
                      Role ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      {...register(
                        `requirements.wallet.collections.${index}.discord.role_id`
                      )}
                      placeholder="8139371938"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="add-collection-button">
        <button
          className="button-primery add-record"
          type="button"
          onClick={handleAddCollection}
        >
          <i className="fa-solid fa-plus"></i> Add another collection
        </button>
      </div>
    </>
  );
};

export default NFTCollection;
