"use client";

import { useAuth } from "@/hooks/useAuth";
import { Camera, Mail, User } from "lucide-react";
import React, { useEffect, useState } from "react";

const UpdataProfile = ({ user }: any) => {
  const [image, setImage] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const {updateProfile} = useAuth(true);

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  useEffect(() => {
    if (user?.name) setFullName(user?.name);
  }, [user?.name]);

  useEffect(() => {
    if (updateProfile.isSuccess) {
      setImage(null);
      setPreview(null);
    }
  }, [updateProfile.isSuccess]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (fullName) formData.append("name", fullName);
    if (image) formData.append("profilePic", image);

    updateProfile.mutate(formData);
  };
  return (
    <div
      className="
        h-screen
        pt-20
      "
    >
      <div
        className="
          max-w-2xl
          mx-auto p-4 py-8
        "
      >
        <div
          className="
            p-6 space-y-8
            bg-base-300
            rounded-xl
          "
        >
          <div
            className="
              text-center
            "
          >
            <h1
              className="
                text-2xl font-semibold
              "
            >
              Profile
            </h1>
            <p
              className="
                mt-2
              "
            >
              Your profile information
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div
              className="
                flex flex-col
                mb-8
                items-center gap-4
              "
            >
              <div
                className="
                  relative
                "
              >
                <img
                  src={preview || user?.profilePic || "/avatar.png"}
                  alt=""
                  className="
                    object-cover object-center
                    rounded-full border-4
                    size-32
                  "
                />
                <label
                  htmlFor="avatar-upload"
                  className="
                    p-2
                    text-white
                    bg-primary
                    rounded-full
                    cursor-pointer
                    absolute bottom-0 right-0
                  "
                >
                  <Camera />
                  <input
                    type="file"
                    id="avatar-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImage(e.target.files[0]);
                      }
                    }}
                    className="
                      hidden
                    "
                  />
                </label>
              </div>
              <p
                className="
                  text-sm
                "
              >
                Click on the camera icon to upload a photo
              </p>
            </div>
            <div
              className="
                space-y-4
              "
            >
              <div
                className="
                  flex flex-col
                  gap-2
                "
              >
                <label
                  htmlFor="fullName"
                  className="
                    flex
                    items-center gap-1
                  "
                >
                  <User /> Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="
                    w-full
                    p-2
                    border border-white rounded-lg
                  "
                />
              </div>
              <div
                className="
                  flex flex-col
                  gap-2
                "
              >
                <label
                  htmlFor="email"
                  className="
                    flex
                    items-center gap-1
                  "
                >
                  <Mail /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user?.email}
                  readOnly
                  className="
                    w-full
                    p-2
                    border border-white rounded-lg
                  "
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={
                updateProfile.isPending || (fullName === user?.name && !image)
              }
              className="
                w-full
                mt-5
                btn btn-primary
              "
            >
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div
          className="
            mt-6 p-6
            bg-base-300
            rounded-xl
          "
        >
          <h1
            className="
              text-xl font-semibold mb-4
            "
          >
            Account Information
          </h1>
          <div className=" space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              {" "}
              <p>Member Since :</p>{" "}
<p>
  {user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "—"}
</p>
            </div>
            <div className="flex items-center justify-between">
              {" "}
              <p>status :</p> <p className="text-green-500">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdataProfile;
