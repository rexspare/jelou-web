import { LoginImage } from "@apps/platform/login";
import React from "react";
import ResetForm from "./components/ResetForm";

const Reset = () => {
    return (
        <div className="flex h-screen min-h-screen bg-white">
            <ResetForm
                {...this.props}
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
                errors={this.state.errors}
                errorsObj={this.state.errorsObj}
                loading={this.state.loading}
                feedback={this.state.feedback}
                redirectLogin={this.state.redirectLogin}
            />
            <div className="relative hidden items-center justify-center md:flex md:flex-1">
                <LoginImage></LoginImage>
            </div>
        </div>
    );
};

export default Reset;
